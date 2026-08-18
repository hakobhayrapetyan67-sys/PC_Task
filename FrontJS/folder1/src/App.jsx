import { useState } from "react"

export function App(){

  const [students,setStudent] = useState([
     {id: 101, name: "Jhonathan", age: 22},
     {id: 102, name: "Jhon", age: 23}, 
     {id: 103, name: "Armen", age: 24}, 
     {id: 104, name: "Karen", age: 25} 
    ])
  
  const handlerRemove = (id) => {
    setStudent(students.filter(s => s.id !== id))
  }
  return (<>
    <div className="row">
      {
        students.map(student => 
          <div className = "col-md-3"key={student.id} >
            <p>{student.name}</p>
            <p>{student.age}</p>
            <button onClick={() => handlerRemove(student.id)}>remove</button>
          </div>
        )
      }
    </div>
  </>)
  
}