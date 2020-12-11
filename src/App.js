import Header from "./Header";
import { startAppManager } from './engine/engine';

class App {
    componentDidMount() {
        alert()
    }
    render() {
        Promise.resolve().then(() => {
            onApplicationStart(component);
        });
        const component = <Header>
            <div>
                <canvas id="canvas" width={"1800px"} height={"1000px"}></canvas>
            </div>
        </Header>;
        return component;
    }
}

export default App;
function onApplicationStart(component) {
    startAppManager(component);
    //start skirmish 
}

