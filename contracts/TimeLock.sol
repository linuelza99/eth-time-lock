pragma solidity ^0.5.0;

contract TimeLock{
	uint public taskCount=0;
    uint public publicKey;
    uint public privateKey;
    uint public prime=383;
    uint public primitiveRoot=2;
    uint public seed;
    uint public seed2=0;
    uint public deadline;
    uint public duration=30;
    uint public flag=0;

    event publicKeyCreated(
        uint pubKey,
        uint seed
    ); 

    event privateKeyCreated(
        uint privKey
    );

    constructor() public {
    }

    function generatePublicKey(uint _seed) public{
        if(flag==0)
        {
            publicKey=((_seed**2)+47)%prime;
            flag=1;
            deadline=now+duration;
            seed=_seed;
        }
        if(now<deadline)
        {
            uint newSeed=_seed+seed2;
            publicKey=((newSeed**2)+47)%prime;
        }
        emit publicKeyCreated(publicKey,_seed);
    }

function testPrivateKey(uint _privateKey) public{
        uint primitiveRootTemp=primitiveRoot;
        uint[] memory exp = toBinary(_privateKey);
        uint y=1;
        for(uint i=0;i<100;i++)
        {
            uint power=exp[i];
            if(power==1)
            {
                y=(primitiveRoot*y)%prime;
            }
            primitiveRoot=(primitiveRoot**2)%prime;
        }
        if(y==publicKey)
        {
            privateKey=_privateKey;
            emit privateKeyCreated(_privateKey);
        }
        primitiveRoot=primitiveRootTemp;
    }
    
function toBinary(uint n) public view returns (uint[] memory) {

    uint[] memory output = new uint[](256);

    for (uint8 i = 0; i < 100; i++) {
        output[i] = (n % 2 == 1) ? 1 : 0;
        n /= 2;
    }

    return output;
}
}