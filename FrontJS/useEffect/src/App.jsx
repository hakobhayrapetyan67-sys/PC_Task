// amen anqam rendera linum. 1
// 
// import { useState, useEffect } from 'react';

// export default function App() {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     console.log("Աշխատեց ամեն ռենդերի ժամանակ");
//   }); // Ուշադրություն: զանգված չկա

//   return (
//     <button onClick={() => setCount(count + 1)}>
//       Թիվ: {count}
//     </button>
//   );
// }


// datark zangvacn miain meka anqama ashxatum mountingi jamanak 2
//
// import { useState, useEffect } from "react";

// export default function App(){
//   const [user, setUs] = useState(null);

//   useEffect(() => {
//     fetch('https://jsonplaceholder.typicode.com/users/1')
//     .then(res => res.json())
//     .them(daata => setUs(data));
//   }, []); // datark zangvacn miain meka anqama ashxatum

//   return (
//     <div>
//       {user ? <h3>barev, {user.name} </h3>: <p>bernvum e...</p>}
//     </div>
//   )
// }


// metod 3
//
// import { useState, useEffect } from "react";

// export default function App(){
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     console.log(` countn poxvec: ${count}`);
//   }, [count]);

//   return (
//     <button onClick={() => setCount(count + 1)}>
//       tivn: {count}
//     </button>
//   )
// }

// motecum 4
//
// import {useState, useEffect} from 'react';

// export default function App(){
//   const [seconds, setSeconds] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setSeconds(s => s + 1);
//     }, 1000);
  

//   return () => {
//     clearInterval(interval);
//     console.log("taymern maqrvec");
//   };
//   }, []);

//   return <h1>varkyan : {seconds}</h1>
// }








