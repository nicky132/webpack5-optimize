import React from 'react'
import Hello from '@/hello.tsx';
import '@/assets/css/test.module.scss'

function testTreeShaking () {
    let testShaking = 'nickytestShaking'
    return testShaking
}

export default function App () {
    return (
        <div>
            hello react17
            <Hello />
            <button onClick={() => import('lodash')}>加载lodash</button>
        </div>
    )
}
