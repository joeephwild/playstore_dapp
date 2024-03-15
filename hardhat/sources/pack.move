module game_pack::pack {import 0x1::ink_lang;
import 0x2::psp34;


pub struct PackContract {
    game_address: address,
    pack_name: string,
    pack_desc: string,
    quantity: u128,
    price: u128,
    owner: address,
}

pub struct Packs {
    all_pack: vector<PackContract>,
    address_to_pack: map<address, PackContract>,
    id_to_pack: map<u128, PackContract>,
}

pub enum Error {
    FailedToInsert,
}

event Pacs();

pub struct PackContract;

pub impl PackContract {
    pub fun new() -> Self {
        PackContract {}
    }
}

pub struct Packs;

pub impl Packs {
    pub fun new() -> Self {
        Packs {
            all_pack: Vector::empty(),
            address_to_pack: Map::new(),
            id_to_pack: Map::new(),
        }
    }

    pub fun create_pack(&mut self, _pack_address: address, desc: string, _name: string, amount: u128, _quantity: u128, _receiver: address) {
        let _caller: address = get_caller();
        let pack = PackContract {
            game_address: _pack_address,
            pack_desc: desc,
            pack_name: _name,
            price: amount,
            quantity: _quantity,
            owner: _receiver,
        };
        self.address_to_pack.insert(_caller, pack.clone());
        self.all_pack.push_back(pack.clone());
        self.id_to_pack.insert(self.all_pack.len() as u128, pack.clone());
    }

    pub fun buy_pack(&mut self, _quantity: u128, _id: u128) -> u128 {
        let money_sent: u128 = LibraAccount::balance();
        let pack: PackContract = match self.id_to_pack.get(_id) {
            Some(pack) => move_from(pack),
            None => LibraAccount::panic_str("Pack does not exist"),
        };
        assert(money_sent >= pack.price, "Insufficient Funds");

        // send required money to the pack owner
        if LibraAccount::transfer(pack.owner, money_sent).is_err() {
            LibraAccount::panic_str("Error transferring");
        }

        pack.quantity - _quantity
    }

    pub fun retrive_all_pack(&self) -> vector<PackContract> {
        self.all_pack.clone()
    }
}
}