/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { CADElement } from '../shared/types';

export function CADViewport({ elements }: { elements: CADElement[] }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <gridHelper args={[100, 100, '#444', '#222']} rotation={[Math.PI / 2, 0, 0]} />
      
      {elements.map((el) => (
        <mesh
          key={el.id}
          position={el.position}
          rotation={el.rotation}
          scale={el.scale}
        >
          {el.type === 'box' && <boxGeometry />}
          {el.type === 'sphere' && <sphereGeometry />}
          {el.type === 'cylinder' && <cylinderGeometry />}
          <meshStandardMaterial color={el.color} />
        </mesh>
      ))}
    </>
  );
}
