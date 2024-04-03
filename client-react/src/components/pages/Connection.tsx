import { Col, Row, Divider, Input, Checkbox } from 'antd';
import Button from "../common/Button.tsx";
// import "../assets/styles/Connection.module.css"
import styles from "../assets/styles/Connection.module.css"
export default function Connection(){
    return (
        <>
            <div className={styles.loginContainer}>
            <Row className={styles.antRow}>
                <Col span={12} className={styles.columnFlex}>
                    <h1>Se Connecter</h1>
                    <Input className={styles.antInput} placeholder="Username"/>
                    <Input className={styles.antInput} placeholder="Password"/>
                    <Checkbox >Se souvenir de moi</Checkbox>
                    <div className={styles.buttonContainer}>
                    <Button text="Connexion" color="FFA500" size="28"/>
                    </div>
                </Col>
                <Col span={1}  className={styles.columnFlex}> <Divider type="vertical" className={styles.dividerVertical} /></Col>
                <Col span={11} className={styles.columnFlex} >
                    <img src="/connexion_nourriture.png" alt="food"/>
                </Col>
            </Row>
            </div>

        </>
    )
}
