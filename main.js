const SHA256 = require('crypto-js/sha256');

class Block {
    // index is the "position" of this block in the chain.
    // data is the information to save in the block
    constructor(index,data,previousHash=''){
        this.index = index;
        this.date = new Date().getTime();
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.date + this.data + this.previousHash + this.nonce).toString();
    }

    getHash(){
        return this.hash;
    }

    mine(difficulty){
        while(!this.hash.startsWith(difficulty)){
            this.nonce++;
            this.hash = this.calculateHash()
        }
    }
}


class BlockChain {
    constructor(genesis, difficulty = ''){
        this.chain = [this.createFirstBlock(genesis)];
        this.difficulty = difficulty;
    }

    createFirstBlock(genesis) {
        return new Block(0, genesis);
    }

    getLastBlock(){
        return this.chain[this.chain.length-1];
    }

    addBlock(data){
        let lastBlock = this.getLastBlock();
        let newBlock = new Block(this.chain.length, data, lastBlock.hash);
        newBlock.mine(this.difficulty);
        console.log('Block added with hash: ' + newBlock.hash + ' nonce: ' + newBlock.nonce);
        this.chain.push(newBlock);
        // adding characters it is possible to increase the mining difficulty. Ex: '0'
        this.difficulty += '';
    }

    isValid(){
        for (let i = 1; i < this.chain.length; i++) {
            let prev = this.chain[i-1];
            let curr = this.chain[i];

            if(curr.previousHash != prev.hash) return false;
            let cHash= curr.calculateHash()
            if(cHash != curr.hash) {
                console.log(cHash)
                return false
            };
            
        }
        return true
    }

    print() {
        return JSON.stringify(this.chain,null,2);
    }

}

console.clear();
// Create the block chain with the genesis block
let q = new BlockChain('hola mundo', '0');
// Add some blocks with data
q.addBlock('my first block');
q.addBlock('very important data');
q.addBlock('some data');
q.addBlock('another block');
console.info(`Chain on ${getDate()} at ${getTime()} `);
console.info('Blockchain valid: ' + q.isValid())
console.info(q.print());

q.chain[2].data = "Aloha!";
console.info(`Chain on ${getDate()} at ${getTime()} `);
console.info('Blockchain valid: ' + q.isValid())
console.info(q.print());

/**
 * returns a date in format dd/mm/yyyy
 */
function getDate() {
    let d = new Date();
    return (`${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`);
}

/**
 * 
 * @returns time with format hh:mm 
 */
function getTime() {
    let d = new Date();
    return (`${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`);
}