import React, { useCallback, useEffect, useState, } from 'react';
import Box from '3box';
import Web3 from 'web3';
import { MetaMaskButton, Loader, } from 'rimble-ui';

const MarkethPlace = () => {

  const [ web3, setWeb3, ] = useState();
  const [ address, setAddress, ] = useState();
  const [ box, setBox, ] = useState();
  const [ loading, setLoading, ] = useState();
  const [ profile, setProfile, ] = useState();

  useEffect(() => {
    setWeb3(new Web3(Web3.givenProvider));
  }, [ setWeb3, ]);

  const connect = useCallback(async () => {
    setLoading(true);
    const accounts = await web3.eth.requestAccounts();
    setAddress(accounts[0]);
  }, [ web3, setAddress, setLoading, ]);

  useEffect(() => {
    if (!address) return;
    const getBox = async () => {
      setBox(await Box.openBox(address, Web3.givenProvider));
      setLoading(false);
    }
    getBox();
  }, [ setBox, address, setLoading, ]);

  useEffect(() => {
    if (!box) return;
    const getProfile = async () => {
      setProfile(await box.public.all());
    }
    getProfile();
  }, [ box, setProfile, ]);

  console.log(JSON.stringify(profile, null, 2));

  return (
    <div
      css={`
        display: flex;
      `}
    >
      { !address && (
        <MetaMaskButton
          onClick={ connect }
        >
          Conéctate con Metamask
        </MetaMaskButton>
      ) }
      { loading && <Loader/> }
      { profile && (
        <div>
          <div>
            { profile.name } { profile.emoji }
          </div>
          <div>
            { profile.description }
          </div>
          <div>
          </div>
        </div>
      ) }
    </div>
  );
}

export default MarkethPlace
