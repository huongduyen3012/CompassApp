import {NativeModules} from 'react-native';

interface CompassModuleInterface {
  startCompass(): Promise<number>;
  stopCompass(): Promise<number>;
}

const {CompassModule} = NativeModules;
export interface CompassData {
  degree: number;
}

export default CompassModule as CompassModuleInterface;
