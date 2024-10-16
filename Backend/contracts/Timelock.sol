// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.27;

contract Timelock{
    struct Message{
        address user;
        string text;
        uint256 unlockTime;
    }

    struct RevealedMessage {
        string text;
        uint256 unlockTime;
    }
    

    Message[] public messages;

    function setMessage(string memory _message) public {
        bool updated = false;
        for(uint256 i = 0; i < messages.length; i++){
            if(messages[i].user == msg.sender){
                if(block.timestamp < messages[i].unlockTime){
                    messages[i].text = _message;
                    messages[i].unlockTime = block.timestamp + 15 seconds;
                }else{
                    messages[i].text = _message;
                    messages[i].unlockTime = block.timestamp + 15 seconds;
                }
                updated = true;
                break;
            }
        }
        if(!updated) {
            messages.push(Message({
                user: msg.sender,
                text: _message,
                unlockTime: block.timestamp + 15 seconds
            }));
        } 
    }

    function revealMessage() public view returns(RevealedMessage[] memory){
        RevealedMessage[] memory revealedMessages = new RevealedMessage[](messages.length);
        for(uint256 i = 0; i < messages.length; i++){
            if(block.timestamp < messages[i].unlockTime){
                uint256 remainingTime = messages[i].unlockTime - block.timestamp;
                revealedMessages[i] = RevealedMessage({
                    text: string(abi.encodePacked('Message is still locked. Time remaining: ', convertToString(remainingTime), ' seconds')),
                    unlockTime: messages[i].unlockTime
                });
            } else {
                revealedMessages[i] = RevealedMessage({
                    text: messages[i].text,
                    unlockTime: messages[i].unlockTime
                    });
            }
        }
        return revealedMessages;
    }

    function convertToString(uint256 _i) internal pure returns (string memory) {
        if(_i == 0){
            return '0';
        }
        uint256 j =_i;
        uint256 length;
        while(j!=0){
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        while(_i != 0){
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i /10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}