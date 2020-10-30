import React, { useCallback, useEffect, useState, } from 'react';
import Box from '3box';
import Web3 from 'web3';
import { Avatar, MetaMaskButton, Loader, Card, Text, Icon} from 'rimble-ui';
import styled from 'styled-components';

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

  const InfoFrom3box = styled.div`
    color: #558891;
    font-size:26px;
  `;

  const CenterLoader = styled.div`
    display:flex;
    justify-content:center;
  `;

  return (
    <div>

      <Card width={"auto"} maxWidth={"420px"} mx={"auto"}>
        <Text
          caps
          fontSize={0}
          fontWeight={4}
          mb={3}
          display={"flex"}
          alignItems={"center"}
        >
        <Icon name={"AccountBox"} mr={20} />
          Bievenido a markethPlace:
      </Text>
      { !address && (
        <MetaMaskButton.Outline
          onClick={ connect }
        >
          Usar Metamask
        </MetaMaskButton.Outline>
      ) }

      <CenterLoader>  
        { loading && <Loader color="black" display={"flex"}/> }
      </CenterLoader>
      { profile && (
        <div>
          <Avatar
            src={"https://ipfs.infura.io/ipfs/"+profile.image[0].contentUrl["/"]}
            size="100px"
          />
          <InfoFrom3box>
            <Icon name={"AccountCircle"} mr={2} />
            { profile.name } { profile.emoji }
          </InfoFrom3box>
          <div>
            { profile.description }
          </div>
          <div>
          </div>
        </div>
      ) }
      </Card>
    </div>
  );
}

export default MarkethPlace
