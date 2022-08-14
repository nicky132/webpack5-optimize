import React from 'react'
import Hello from '@/hello';
import '@/assets/css/test.module.scss'

function testTreeShaking () {
    let testShaking = 'nickytestShaking'
    return testShaking
}
export default function App () {
    return (
        <div>
            hello react
            <Hello />
            <button onClick={() => import('lodash')}>加载lodash</button>
        </div>
    )
}
