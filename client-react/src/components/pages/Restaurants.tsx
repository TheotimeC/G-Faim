import '../assets/styles/navbar.css';
import Button from '../common/Button';
import DefaultButton from '../common/DefaultButton';
import Footer from '../common/Footer';





const Restaurants = () =>{

    /*const handleSubscribe = () => {
        // Implémentez la logique d'abonnement ici
        console.log('Abonnement en cours...');
      };*/

    
    return(
        <div>
            <h1>Restaurants</h1>

            <Button text="Voir Menu" color="298029" size="10" onClick={function (): void {
                throw new Error('Function not implemented.');
            } } />
            <Button text="Commander" color="FFA500" size="10" onClick={function (): void {
                throw new Error('Function not implemented.');
            } } />
            <DefaultButton text="Accepter" textColor="FFFFFF" bgColor="298029" textSize="1rem" width="150px" marginLeft="10px" marginRight="10px" onClick={function (): void {
                throw new Error('Function not implemented.');
            } }/>
            <DefaultButton text="Refuser" textColor="FFFFFF" bgColor="FF3A44" textSize="1rem" width="150px" marginLeft="10px" marginRight="10px" onClick={function (): void {
                throw new Error('Function not implemented.');
            } }/>
            <DefaultButton text="Annuler" textColor="000000" bgColor="9A9BA1" textSize="1rem" width="150px" marginLeft="10px" marginRight="10px" onClick={function (): void {
                throw new Error('Function not implemented.');
            } }/>
            <DefaultButton text="Message" textColor="FFFFFF" bgColor="FFA500" textSize="1rem" width="150px" marginLeft="10px" marginRight="10px" onClick={function (): void {
                throw new Error('Function not implemented.');
            } }/>


            <Footer backgroundColor="D9D9D9" /*onSubscribe={handleSubscribe}*/ />
        </div>
    );
}

export default Restaurants