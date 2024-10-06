import "@/styles/globals.css";
import Header from "../components/header";
import Footer from "../components/footer";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';  
import store, { persistor } from '../store/store';
import { useRouter } from "next/router";



export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isDashboard = router.pathname.startsWith("/dashboard");

  return (
    <div>
       {!isDashboard && <Header />}
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
      <Footer />
    </div>
  );
}
