import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';

function getNowTime() {
  var d = new Date(),
      str = '[';
  str += d.getHours() + ':';
  str += d.getMinutes() + ':';
  str += d.getSeconds() + ':';
  str += d.getMilliseconds();
  str += "] ";
  return str;
}

const keyring = new Keyring({ type: 'sr25519' });
const wsProvider = new WsProvider('wss://rpc.polkadot.io');
const api = await ApiPromise.create({ provider: wsProvider });

const PHRASE = '助记词';

const wallet = keyring.addFromUri(PHRASE);
keyring.setSS58Format(0);

console.log(getNowTime() + "已加载钱包地址: " + wallet.address)
const txs = [
    api.tx.balances.transferKeepAlive(wallet.address, 0),
    api.tx.system.remark('{"p":"dot-20","op":"mint","tick":"DOTA"}'),
];
var count = 0
function run(){

    api.tx.utility
    .batchAll(txs)
    .signAndSend(wallet, ({ status }) => {
  
      if (status.isInBlock) {
        console.log(getNowTime() + `交易已提交，包含在区块 ${status.asInBlock} 中···` );
      } else if (status.isFinalized) {
        console.log(getNowTime() + `交易已在区块 ${status.asFinalized} 中完成！`);
        count += 1
        console.log(getNowTime() + "当前成功次数: " + count)
        // run()
      }
    })
    .catch(err => {
  
    });
  
}


setInterval(function(){
	run();
},3000);