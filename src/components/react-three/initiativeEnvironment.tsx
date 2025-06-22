import {Environment, useEnvironment} from "@react-three/drei";

export function InitiativeEnvironment() {
    const env = useEnvironment({files: '/overcast_soil_puresky_1k.hdr'})

    return <>
        <Environment map={env} background blur={1} backgroundBlurriness={1} backgroundIntensity={0.05}/>
    </>
}