import '../assets/styles/navbar.css';
import Button from '../common/Button';
import DefaultButton from '../common/DefaultButton';

const Restaurants = () =>{
    return(
        <div>
            <h1>Restaurants</h1>
            <Button text="Voir Menu" color="298029" size="10" />
            <Button text="Commander" color="FFA500" size="10" />
            <DefaultButton text="Accepter" textColor="FFFFFF" bgColor="298029" textSize="1rem" width="150px"/>
            <DefaultButton text="Refuser" textColor="FFFFFF" bgColor="FF3A44" textSize="1rem" width="150px"/>
            <DefaultButton text="Annuler" textColor="000000" bgColor="9A9BA1" textSize="1rem" width="150px"/>
            <DefaultButton text="Message" textColor="FFFFFF" bgColor="FFA500" textSize="1rem" width="150px"/>
        </div>
    );
}

export default Restaurants