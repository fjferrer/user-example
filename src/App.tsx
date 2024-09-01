import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

Amplify.configure(outputs);

const client = generateClient<Schema>();


function App() {
  const users: Array<Schema['Todo']['type']> = [];
  const userList = document.getElementById('userList') as HTMLUListElement;
  const [count, setCount] = useState(0)


  function updateUI() {
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user.content ?? '';
        userList.appendChild(li);
    });
  }

  function inc(count: number) {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => {
          users.splice(0, users.length, ...data.items);
          updateUI();
      }
    });

      client.models.Todo.create({ content: `A single entry ${Date.now()}` }).then(response => {
          if (response.data && !response.errors) {
              users.push(response.data);
              updateUI();
          } else {
              console.error('Error creating user:', response.errors);
              alert('Failed to create user.');
          }
      }).catch(error => {
          console.error('Network or other error:', error);
          alert('Failed to create user due to a network or other error.');
      });
    return count + 1
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        {/* <button onClick={() => setCount((count) => count + 1)}> */}
        <button onClick={() => setCount(inc)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <ul id="userList"></ul>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
