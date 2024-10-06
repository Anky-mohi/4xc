import { useEffect } from "react";
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setApiData } from '../store/slices/dataSlice'; 
import styles from "../styles/Login.module.css";

export default function Thankyou() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { acct1, token1, cur1 } = router.query;

    useEffect(() => {
        // Dispatch only when query parameters are available
        if (acct1 && token1 && cur1) {
            const data = { acct1, token1, cur1 };
            dispatch(setApiData(data));
        }
    }, [acct1, token1, cur1, dispatch]);

    return (
        <div className="main">
            <div className={`section-verify`}>
                <div className="overlay"></div>
                <div className={styles.sizer}>
                    <div className={styles.container}>
                        <div className={styles.row}>
                            <h1 className="text-black text-center">
                                Thank you so much for choosing us!
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
