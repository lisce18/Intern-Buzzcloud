// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.27;

contract FavoriteDrink{
    struct Drink{
        address user;
        string text;
    }

    Drink[] public drinks;

    error EmptyDrinkInput();
    error AlreadySubmitted();

    mapping(address => bool) public hasVoted;

    event DrinkSubmitted(address indexed user, string text);

    function setDrink(string memory _drink) public{
        if(hasVoted[msg.sender]){
            revert AlreadySubmitted();
        }

        if(bytes(_drink).length == 0){
            revert EmptyDrinkInput();
        } 

        hasVoted[msg.sender] = true;

        drinks.push(Drink({
            user: msg.sender,
            text: _drink
        }));

        emit DrinkSubmitted(msg.sender, _drink);
    }

    function getDrinks() public view returns(Drink[] memory){
        return drinks;
    }
}

// contract Timelock{
//     struct Message{
//         address user;
//         string text;
//         uint256 unlockTime;
//     }

//     struct RevealedMessage {
//         string text;
//         uint256 unlockTime;
//     }
    

//     Message[] public messages;

//     function setMessage(string memory _message) public {
//         bool updated = false;
//         for(uint256 i = 0; i < messages.length; i++){
//             if(messages[i].user == msg.sender){
//                 if(block.timestamp < messages[i].unlockTime){
//                     messages[i].text = _message;
//                     messages[i].unlockTime = block.timestamp + 15 seconds;
//                 }else{
//                     messages[i].text = _message;
//                     messages[i].unlockTime = block.timestamp + 15 seconds;
//                 }
//                 updated = true;
//                 break;
//             }
//         }
//         if(!updated) {
//             messages.push(Message({
//                 user: msg.sender,
//                 text: _message,
//                 unlockTime: block.timestamp + 15 seconds
//             }));
//         } 
//     }

//     function revealMessage() public view returns(RevealedMessage[] memory){
//         RevealedMessage[] memory revealedMessages = new RevealedMessage[](messages.length);
//         for(uint256 i = 0; i < messages.length; i++){
//             if(block.timestamp < messages[i].unlockTime){
//                 uint256 remainingTime = messages[i].unlockTime - block.timestamp;
//                 revealedMessages[i] = RevealedMessage({
//                     text: string(abi.encodePacked('Message is still locked. Time remaining: ', convertToString(remainingTime), ' seconds')),
//                     unlockTime: messages[i].unlockTime
//                 });
//             } else {
//                 revealedMessages[i] = RevealedMessage({
//                     text: messages[i].text,
//                     unlockTime: messages[i].unlockTime
//                     });
//             }
//         }
//         return revealedMessages;
//     }
// }