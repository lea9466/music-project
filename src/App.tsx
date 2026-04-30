
import './App.css'
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/AppRoutes';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { useState } from 'react';
import SplashScreen from './assets/SplashScreen';


function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) return <SplashScreen onDone={() => setShowSplash(false)} />;
  return (
    <Provider store={store}>
      <RouterProvider router={router} >
      </RouterProvider>
    </Provider>
  )
}

export default App
