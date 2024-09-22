import "@/styles/globals.css";
import Header from "../components/header";
import Footer from "../components/footer";
import { Provider } from "react-redux";
import store from "../store/store";

export default function App({ Component, pageProps }) {
  return (
    <div>
      <Header />
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
      <Footer />
    </div>
  );
}
