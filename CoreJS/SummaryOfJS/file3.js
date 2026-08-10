function groupByGroup(students){
  const groupMap = new Map();
  students.forEach(s => {
    if(!groupMap.has(s.group)){
      groupMap.set(s.group, []);
    }
    groupMap.get(s.group).push(s.name);
  });
  return groupMap;
}

// Input
const students = [
  { name: 'John', group: 'A' },
  { name: 'Anna', group: 'B' },
  { name: 'Max', group: 'A' }
];

// Expected Output
 console.log(groupByGroup(students));
// Map(2) {
//   'A' => ['John', 'Max'],
//   'B' => ['Anna']
// }
