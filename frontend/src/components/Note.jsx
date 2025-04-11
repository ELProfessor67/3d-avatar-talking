import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Note(props) {
  const { nodes, materials } = useGLTF('/models/1bill_note.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes['image_(6)'].geometry} material={materials['image (6)']} position={[0.076, 0.932, 2.018]} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes['image_(7)'].geometry} material={materials['image (7)']} position={[0.076, 0.932, 0.5]} scale={1.5} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  )
}

useGLTF.preload('/models/1bill_note.glb')
// position={[0.076, 0.932, -0.108]}