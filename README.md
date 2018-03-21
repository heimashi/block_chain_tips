# block_chain_tips
汇总BlockChain Bitcoin Ethereum 相关的技术原理的Tips

## Tip 1 - 区块链主要技术 - Hash
Hash算法在区块链技术中被广泛应用，例如钱包的账户地址、哈希指针、工作量证明的挖坑Hash算法、交易的Merkle树等等，掌握Hash算法的技术原理对于理解区块链非常重要。
Hash算法又成为散列算法、哈希算法等，定义如下：
- 把任意长度的输入，通过散列算法，变换成固定长度的输出，该输出就是散列值。
- 常见的Hash算法：md5 sha1 sha256等
- 三个特征
    * 输入任意大小
    * 输出位数是固定的  例如md5输出是128位、sha1输出是160位、sha256是256位
    * 对应n位的字符串其哈希值计算的复杂度是O(n)
    
例如下面通过命令行计算字符串”abc“的md5值、sha1值和sha256值
```SHELL
md5 -s abc
MD5 ("abc") = 900150983cd24fb0d6963f7d28e17f72

echo -n abc | shasum -a 1
a9993e364706816aba3e25717850c26c9cd0d89d

echo -n abc | shasum -a 256
ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
```


### 加密的哈希函数

哈希函数要用来加密，成为加密的哈希函数需要满足一些特性，附加的特性如下：
- 碰撞阻力
    * 碰撞是指两个不同的输入产生了相同的输出，例如A通过Hash得到C，而B通过Hash也得到C，而实际上A和B不相同就产生了碰撞
    * 而md5已经被证明会出现碰撞，Sha256还没找到碰撞，虽然输入空间远远大于输出空间，理论上是必然会出现碰撞，但是例如Sha256哈希算法，输出空间2^256要测出碰撞目前计算能力还没能找到碰撞
    * 应用：**信息摘要** 具有碰撞阻力的Hash算法就可以用来作为摘要算法，摘要可以这么通俗的理解它的含义：我们在写论文的时候，写完了文章的内容以后会给文章写一个文章的摘要，这个摘要就是和这篇文章的内容是一一对应的关系。

- 隐秘性 或者称为不可逆
    * 根据输出值没有可行的办法算出输入值，不可逆
    * 应用：**承诺** 例如我写了一封信后，把信的内容放进信封里，同时把内容的Hash值告诉你，不用告诉你信的内容，我就等于给你承诺了信的内容确实且不能被篡改

- 敏感性 
    * 输入值稍微的改动就会导致输出结果大的改动，找不到变动的规律

- 谜题友好
    * 想找到y值所对应的输入，假定在输入集合中，有一部分是非常随机的，那么他将非常难以求得y值对应的输入
    * 应用：搜索谜题
    

### 哈希链表 或者称为区块链 Block Chain

![img_hash_chain](imgs/img_hash_chain.png)
通过上面的Hash值作为链表的指针就称为哈希链表，与传统的链表结构不一样的是，传统的链表指针记录的是前一个节点的物理地址，而哈希链表的指针指向前一个节点的Hash值，第一个节点是头节点，没有父亲节点，故一般指针值为0。
* 作用：链表内容不可篡改、可追溯

下面我们用NodeJs来实现一个最简单的哈希链表，即区块链，详细代码见[HashChain.js](https://github.com/heimashi/block_chain_tips/blob/master/code/tip1/HashChain.js)：
- 1、首先我们定义区块的结构，像上图所示，一个区块有两个参数，previousHash代表前一个区块的Hash值，data代表区块中记录的数据：
```JavaScript
/*
* 定义区块的数据结构，暂包含两个参数：
* previousHash：前一个区块的Hash值
* data：区块中记录的数据
*/
class Block {
    constructor(previousHash, data) {
        this.previousHash = previousHash.toString();
        this.data = data;
    }
}
```
- 2、创建这个哈希链表的第一个元素，一般称为创世区块，该区块没有前面的区块，故把它的previousHash写死为0:
```JavaScript
/*
* 创建第一区块，即创世块：
* previousHash：没有前一个区块，故写为0
* data：区块中记录的数据
*/
var getGenesisBlock = () => {
    return new Block("0", "I'm the genesis block");
};
```
- 3、初始化哈希链表，初始化的时候区块链中只有一个创世区块
```JavaScript
//blockchain即区块链，初始化时会实例化创世块
var blockchain = [getGenesisBlock()];
```
- 4、开始生成新的区块，构建新区块的过程中，新区块的previousHash值就是现有的区块链中最后的那个区块的Sha256值:
```JavaScript
//根据传人的data内容产生新的区块
var generateNextBlock = (blockData) => {
    var previousBlock = getLatestBlock();
    return new Block(calculateHashForBlock(previousBlock), blockData);
};

//获得区块链中的最后一个区块
var getLatestBlock = () => blockchain[blockchain.length - 1];

//用Sha256计算区块的Hash
var calculateHashForBlock = (block) => {
    return CryptoJS.SHA256(block.previousHash + block.data).toString();
};
```
- 5、将生成的区块添加到区块链中，添加过程中要坚持Hash指针是否一致
```JavaScript
//将生成的新区块加入区块链中
var addBlock = (newBlock) => {
    if (isValidNewBlock(newBlock, getLatestBlock())) {
        blockchain.push(newBlock);
    }
};

//判断新的区块是否合法
var isValidNewBlock = (newBlock, previousBlock) => {
    if (calculateHashForBlock(previousBlock) !== newBlock.previousHash) {
        console.log('invalid previoushash');
        return false;
    } 
    return true;
};
```

经过上面5个步骤就可以构建出一条哈希链表了，我将上面的步骤用vorpal库封装成了交互命令行，方便大家验证代码，测试的步骤如下：
- 1、进入项目的code/tip1目录，执行npm install后，再执行npm start，进入测试的命令行
- 2、运行help查看帮助，主要提供了两个工具命令行，执行bc命令可以查看当前的区块链的具体结构，执行add <data>可以添加新的区块到区块链中，另外执行exit可以退出命令行
```SHELL
HashChainCli$ help

  Commands:

    help [command...]  Provides help for a given command.
    exit               Exits application.
    bc                 show blockchain
    add <data>         add block to chain
```
- 3、例如连续执行add aaa 以及 add bbb后，再通过执行bc命令可以看到区块链中就有了3个区块：
```SHELL

```

### 哈希二叉树 Merkle trees 

![img_hash_merkle_tree](imgs/img_hash_merkle_tree.png)

- 默克尔树（又叫哈希树） 应用于文件系统和p2p网络中 
- 应用：
    * 隶属证明 非隶属证明  
    * 快速比较大量数据  
    * 快速定位修改。
    * 隐私友好的所在性证明 


## Tip 2 - 区块链主要技术 - 数字签名和非对称加密

## Tip 3 - 区块链主要技术 - P2P网络

## Tip 4 - 共识机制 - POW工作量证明

## Tip 5 - 共识机制 - POS


    
