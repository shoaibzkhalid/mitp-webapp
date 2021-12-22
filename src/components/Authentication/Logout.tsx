import { GoogleLogout } from 'react-google-login';
import { AuthCred } from './AuthCreds';
const Logout = (props) => {
    const responseGoogle = () => {
        props.authSuccess(false); 
        console.log("Logged out")
    };

    const clientId = AuthCred.CLIENT_ID;
    const logoutText = props.userName ? `Logout ${props.userName}'s Account` : "Logout";

    return (
        <div>
            <GoogleLogout
                clientId={clientId}
                buttonText={logoutText}
                onLogoutSuccess={responseGoogle}
                className ="google-o-auth-button-logout"
            >
            </GoogleLogout>

        </div>
    )
}

export default Logout;