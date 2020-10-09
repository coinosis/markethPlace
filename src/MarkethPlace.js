import React, { useEffect, useState, } from 'react';
import Box from '3box';
import Web3 from 'web3';

const MarkethPlace = () => {

  const [ web3, setWeb3, ] = useState();
  const [ address, setAddress, ] = useState();
  const [ box, setBox, ] = useState();

  useEffect(() => {
    setWeb3(new Web3(Web3.givenProvider));
  }, [ setWeb3, ]);

  useEffect(() => {
    if (!web3) return;
    const getAccounts = async () => {
      const accounts = await web3.eth.requestAccounts();
      setAddress(accounts[0]);
    }
    getAccounts();
  }, [ web3, setAddress, ]);

  useEffect(() => {
    setBox(Box.openBox(address, Web3.givenProvider));
  }, [ setBox, address, ]);

  return (
    <div>hola, mundo!</div>
  );
}

export default MarkethPlace
