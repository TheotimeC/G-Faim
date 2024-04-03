import {Drawer} from "antd";
type DrawerType ={
    drawerState: boolean;
    setDrawerState: any;
}
export default function Panier({drawerState, setDrawerState}: DrawerType){
    const turnOff = () => {
        setDrawerState(false);
    }
    return (
        <>
            <Drawer title="Basic Drawer" onClose={turnOff} open={drawerState}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
        </>
    )
}