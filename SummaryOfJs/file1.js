function getUniqueUsers(users){
  const userMap = new Map();

  users.forEach(user => {
    userMap.set(user.id, user);
  });
  return Array.from(userMap.values());
}


// Input
const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Anna' },
  { id: 1, name: 'John' } // duplicate
];

// Expected Output
 console.log(getUniqueUsers(users));
//
