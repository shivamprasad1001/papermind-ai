import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import ToastContainer from './components/common/ToastContainer';
import HelpButton from './components/common/HelpButton';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans">
        <Layout />
        <ToastContainer />
        <HelpButton />
      </div>
    </AppProvider>
  );
}

export default App;
