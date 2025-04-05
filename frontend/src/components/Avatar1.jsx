import React, { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Avatar(props) {
  const { nodes, materials } = useGLTF('/models/george-washinhton.glb');



  useEffect(() => {
    // nodes.george_3D_model001_1.morphTargetInfluences[
    //   nodes.Wolf3D_Teeth.morphTargetDictionary[
    //   corresponding[mouthCue.value]
    //   ]
    // ] = 1;
    console.log(nodes.george_3D_model001_1.morphTargetInfluences[nodes.george_3D_model001_1.morphTargetDictionary["TH"]] = 1)
  },[])
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.george_3D_model.geometry}
        material={materials.lambert1SG}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.george_3D_model002.geometry}
        material={materials.lambert1SG}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh
          name="george_3D_model003_1"
          castShadow
          receiveShadow
          geometry={nodes.george_3D_model003_1.geometry}
          material={materials.lambert1SG}
          morphTargetDictionary={nodes.george_3D_model003_1.morphTargetDictionary}
          morphTargetInfluences={nodes.george_3D_model003_1.morphTargetInfluences}
        />
        <mesh
          name="george_3D_model003_2"
          castShadow
          receiveShadow
          geometry={nodes.george_3D_model003_2.geometry}
          material={materials.initialShadingGroup}
          morphTargetDictionary={nodes.george_3D_model003_2.morphTargetDictionary}
          morphTargetInfluences={nodes.george_3D_model003_2.morphTargetInfluences}
        />
      </group>
      <primitive object={nodes.face} />
      <primitive object={nodes.root} />
      <primitive object={nodes['MCH-eyeparentL']} />
      <primitive object={nodes['MCH-eyeparentR']} />
      <primitive object={nodes['MCH-lip_armBL001']} />
      <primitive object={nodes['MCH-lip_armBR001']} />
      <primitive object={nodes['MCH-lip_armTL001']} />
      <primitive object={nodes['MCH-lip_armTR001']} />
      <skinnedMesh
        name="george_3D_model001_1"
        geometry={nodes.george_3D_model001_1.geometry}
        material={materials.lambert1SG}
        skeleton={nodes.george_3D_model001_1.skeleton}
        morphTargetDictionary={nodes.george_3D_model001_1.morphTargetDictionary}
        morphTargetInfluences={nodes.george_3D_model001_1.morphTargetInfluences}
      />
      <skinnedMesh
        name="george_3D_model001_2"
        geometry={nodes.george_3D_model001_2.geometry}
        material={materials.initialShadingGroup}
        skeleton={nodes.george_3D_model001_2.skeleton}
        morphTargetDictionary={nodes.george_3D_model001_2.morphTargetDictionary}
        morphTargetInfluences={nodes.george_3D_model001_2.morphTargetInfluences}
      />
    </group>
  )
}

useGLTF.preload('/models/george-washinhton.glb')
