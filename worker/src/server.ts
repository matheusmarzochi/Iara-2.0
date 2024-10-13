import { consumer as ResearchConsumer } from './queue/research'

async function main() {
  
  ResearchConsumer.start();
  // How to Send:
  // producer.send(`That is my message ${number}`);
  
  console.log('Worker is running...');
}

main().catch((err) => {
  console.error('Error starting the worker:', err);
});