import {useTexture} from "@react-three/drei"
import {MeshStandardMaterial, Texture} from "three";

export const DmScreen = () => {
    const [dmInside] = useTexture(['/dm-inside.jpg'])
    const [dmOutside] = useTexture(['/dm-outside.jpg'])
    const [roughnessMap] = useTexture(['/noise-texture.jpg'])

    const scale = 16;
    const panelWidth = 1 * scale;
    const panelHeight = 0.8 * scale;
    const panelDepth = 0.005 * scale;
    const panelOverlap = 0.04 * scale;
    const foldAngle = Math.PI / 8; // 22.5 degrees

    // Create materials for each panel (inside and outside)
    const createPanelMaterials = (insideTexture: Texture, outsideTexture: Texture) => [
        new MeshStandardMaterial({map: outsideTexture, roughnessMap: roughnessMap, roughness: 0.8}), // +X (right)
        new MeshStandardMaterial({map: insideTexture, roughnessMap: roughnessMap, roughness: 0.8}), // -X (left)
        new MeshStandardMaterial({roughnessMap: roughnessMap, roughness: 0.8}), // +Y (top)
        new MeshStandardMaterial({roughnessMap: roughnessMap, roughness: 0.8}), // -Y (bottom)
        new MeshStandardMaterial({map: insideTexture, roughnessMap: roughnessMap, roughness: 0.8}), // +Z (front)
        new MeshStandardMaterial({map: outsideTexture, roughnessMap: roughnessMap, roughness: 0.5})  // -Z (back)
    ];

    return (
        <group position={[0, -6, 0]}>
            {/* Left Panel */}
            <mesh position={[-(panelWidth - panelOverlap), 0, 0.19 * scale]} rotation={[0, foldAngle, 0]}>
                <boxGeometry args={[panelWidth, panelHeight, panelDepth]}/>
                <primitive object={createPanelMaterials(dmInside, dmOutside)} attach="material"/>
            </mesh>

            {/* Center Panel */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[panelWidth, panelHeight, panelDepth]}/>
                <primitive object={createPanelMaterials(dmInside, dmOutside)} attach="material"/>
            </mesh>

            {/* Right Panel */}
            <mesh position={[(panelWidth - panelOverlap), 0, 0.19 * scale]} rotation={[0, -foldAngle, 0]}>
                <boxGeometry args={[panelWidth, panelHeight, panelDepth]}/>
                <primitive object={createPanelMaterials(dmInside, dmOutside)} attach="material"/>
            </mesh>
        </group>
    );
}