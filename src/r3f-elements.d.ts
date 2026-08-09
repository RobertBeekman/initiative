import type {ThreeElement} from '@react-three/fiber';
import type {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry';

declare module '@react-three/fiber' {
    interface ThreeElements {
        textGeometry: ThreeElement<typeof TextGeometry>;
    }
}
