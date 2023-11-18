import styles from './styles/inline-block-demo.module.css';

const InlineBlockDemo = () => {
  return (
    <div className={styles.container}>
      <div className={styles.centered}>
        <div className={styles.content}>content</div>
      </div>
    </div>
  );
};

export default InlineBlockDemo;
