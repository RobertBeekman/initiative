import {Environment, useEnvironment} from "@react-three/drei";

export function InitiativeEnvironment() {
    const env = useEnvironment({files: '/scythian_tombs_2_1k.hdr'})

    return <>
        <Environment map={env} background backgroundBlurriness={0.8} backgroundIntensity={0.2} environmentIntensity={0.1}/>
    </>
}