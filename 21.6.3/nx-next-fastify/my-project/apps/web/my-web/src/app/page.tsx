'use client';

import styles from './page.module.css';
import ServerInfo from './components/server-info';
import { MyUx } from '@my-project/my-ux';

export default function Index() {
  const handleClick = () => {
    console.log('Button clicked! - client side');
  };

  const fetchServerData = async () => {
    console.log('Fetching data from server... - client side');

    try {
      ServerInfo(); // Call the server component function to log server-side message
      const fastifyApi = await fetch('http://localhost:9000');
      const nextApi = await fetch('/api/data');

      const data = {
        nextApi: await nextApi.json(),
        fastifyApi: await fastifyApi.json(),
      };

      console.log('Received server data:', data);
    } catch (error) {
      console.error('Error fetching server data:', error);
    } finally {
    }
  };

  return (
    <div className={styles.page}>
      <h1>Full Stack Debugging Demo</h1>
      <MyUx />
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleClick} style={{ marginRight: '10px' }}>
          Client Debug Log
        </button>

        <button onClick={fetchServerData} style={{ marginRight: '10px' }}>
          Server Debug Log
        </button>
      </div>
    </div>
  );
}
