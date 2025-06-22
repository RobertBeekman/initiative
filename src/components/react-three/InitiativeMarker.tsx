import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";
import domine from "../../../public/fonts/Domine_Regular.json";
import {RoundedBoxGeometry} from "@react-three/drei";
import {extend} from "@react-three/fiber";
import {Base, Geometry, Subtraction} from '@react-three/csg'

extend({TextGeometry})

export function InitiativeMarker({text, textColor, boxColor}: { text: string, textColor: string, boxColor: string }) {
    const font = new FontLoader().parse(domine);
    const size = 0.5;
    const depth = 0.1;

    // Create geometry to get bounding box
    const geometry = new TextGeometry(text, {font, size, depth});
    geometry.computeBoundingBox();
    const bbox = geometry.boundingBox;
    const width = bbox ? bbox.max.x - bbox.min.x : 0;
    const height = bbox ? bbox.max.y - bbox.min.y : 0;

    const padding = 0.5;
    const boxDepth = 0.5;
    const boxRadius = 0.08;

    // Groove dimensions
    const grooveWidth = width + 1;
    const grooveDepth = boxDepth / 2;
    const grooveHeight = 1;
    const grooveOffsetY = -(height + padding) / 2;

    return (
        <group dispose={null}>
            <mesh receiveShadow>
                <Geometry>
                    <Base>
                        <RoundedBoxGeometry args={[width + padding, height + padding, boxDepth]} radius={boxRadius}/>
                    </Base>
                    <Subtraction position={[0, grooveOffsetY, 0]}>
                        <boxGeometry
                            args={[grooveWidth, grooveHeight, grooveDepth]}
                        />
                    </Subtraction>
                </Geometry>

                <meshPhysicalMaterial
                    color={boxColor}
                    roughness={0.85}
                    metalness={0}
                    clearcoat={0.2}
                    clearcoatRoughness={0.7}
                />
            </mesh>
            <mesh castShadow position={[-width / 2, -height / 2, boxDepth / 2]}>
                <textGeometry args={[text, {font, size, depth}]}/>
                <meshPhysicalMaterial
                    color={textColor}
                    roughness={0.85}
                    metalness={0}
                    clearcoat={0.2}
                    clearcoatRoughness={0.7}
                />
            </mesh>
        </group>
    );
}