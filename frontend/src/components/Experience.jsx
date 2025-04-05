import { Environment, Html, OrbitControls, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Avatar } from "./Avatar";
import { useState } from "react";

export const Experience = ({ rotation }) => {
  const [status, setStatus] = useState("Connecting...")
  const texture = useTexture("textures/youtubeBackground.jpg");
  const viewport = useThree((state) => state.viewport);


  return (
    <>
      <OrbitControls
        enableZoom={false} enableRotate={false}
      />
      <Html position={[0,2.6,0]}>
        <div className="status-box">
          {status}
        </div>
      </Html>
      <Avatar position={[0, -3, 3.5]} scale={2} rotation={rotation} setStatus={setStatus}/>
      <Environment preset="sunset" />
      <mesh>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </>
  );
};
