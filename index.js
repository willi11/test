'use strict'

class TestSQS {
    constructor (queueUrl, sqs, lambda) {
        this.maxMessages = 10
        this.queueUrl = queueUrl
        this.aws = {
            sqs,
            lambda
        }

        this.metrics = {
            processed: 0,
            iteration: 0
        }

        if (!this.queueUrl) {
            throw new Error('Missing URL for SQS Queue')
        }

        if (!this.aws.sqs) {
            throw new Error('Missing SQS Queue')
        }

        this.load()
    }

    promisify (method, params = {})  {
        const self = this
        const promise = new Promise((resolve, reject) => {
            self.aws.sqs[method](params, (err, data) => {
                if(err) {
                    reject(err)
                }
                resolve(data)
            })
        })
        return promise
    }

    async load () {
        const params = {
            MaxNumberOfMessages: this.maxMessages,
            MessageAttributeNames: ['All'],
            QueueUrl: this.queueUrl
        }
        const list =  await this.promisify('receiveMessage',params)
        this.metrics.iteration += 1
        if (!list || !list.Messages) {
            return []

        }
        return list.Messages
    }
}

module.exports = TestSQS
