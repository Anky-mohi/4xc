import "@/styles/globals.css";
import Header from "../components/header";
import Footer from "../components/footer";
import { Provider } from "react-redux";
import store from "../store/store";
import { useRouter } from "next/router";



export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isDashboard = router.pathname.startsWith("/dashboard");

  return (
    <div>
       {!isDashboard && <Header />}
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
      <Footer />
    </div>
  );
}
