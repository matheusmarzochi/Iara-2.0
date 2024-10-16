import { producer } from './queue/index'

const enqueue = async() => {
    producer.send("adba3d8d-b772-49b1-9a65-701a82e1a205")
}

const runner = () => {
    enqueue()
}

runner()