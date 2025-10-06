import styles from './my-ux.module.css';

export function MyUx() {
  const handleClick = () => {
    console.log('Button clicked! - client side');
  };

  return (
    <div className={styles['container']}>
      <h1>Welcome to MyUx!</h1>
      <button onClick={handleClick} style={{ marginRight: '10px' }}>
        MyUx Button
      </button>
    </div>
  );
}

export default MyUx;
