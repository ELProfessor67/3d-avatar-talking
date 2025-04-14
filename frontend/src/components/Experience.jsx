import { Environment, Html, OrbitControls, useTexture, Gltf, useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useState } from "react";
import { Note } from "./Note";
import { Avatar } from "./Avatar";

export const Experience = ({ rotation }) => {
  const [status, setStatus] = useState("Connecting...")
  const texture = useTexture("textures/botton-only.png");
  const viewport = useThree((state) => state.viewport);


  return (
    <>
      <OrbitControls
        enableZoom={false} enableRotate={false}
      />
      <Html position={[0,2.7,0]}>
        <div className="status-box">
          {status}
        </div>
      </Html>
      <Avatar position={[-0.1, -1.85, 1.5]} scale={1.49999999999999999999999} setStatus={setStatus}/>
      <Note position={[-0.1, -1.5, 0]} scale={1.49999999999999999999999}/>
      <Environment preset="sunset" />
      <mesh scale={1}>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </>
  );
};

