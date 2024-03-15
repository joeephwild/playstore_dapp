module my_first_package::my_module {
    
pub struct App {
    uri: string,
    owner: address,
    price: u64,
    app_id: u128,
}

pub struct StoreContract {
    all_app: vector<App>,
    address_app_count: map<address, u64>,
    id_to_app: map<u64, App>,
    app_count: u128,
    address_to_app: map<address, vector<App>>,
}

event AppUploaded(app_id: u64, uri: string, owner: address, price: u64);
event AppInstalled(app_id: u64, buyer: address, owner: address, price: u64);

public fun StoreContract() {
    self.all_app = Vector::empty();
    self.address_app_count = Map::new();
    self.id_to_app = Map::new();
    self.app_count = 0;
    self.address_to_app = Map::new();
}

public fun StoreContract::upload_an_app(_app_uri: string, _amount: u64) -> u128 {
    let caller: address = get_caller();
    let mut count: u128 = self.app_count;

    let new_app = App {
        uri: _app_uri,
        owner: caller,
        price: _amount,
        app_id: count,
    };
    self.all_app.push_back(new_app.clone());

    count += 1;
    self.app_count = count;
    count
}

public fun StoreContract::install_app(app_id: u64) {
    let caller: address = get_caller();
    let app: &App = move_from(self.id_to_app.get(app_id).expect("App does not exist"));
    assert(move_from(Env::transferred_value()) >= app.price, "Insufficient Funds");
    assert(caller != app.owner, "Owner can't download");

    if Env::transfer(app.owner, move_from(Env::transferred_value())).is_err() {
        LibraAccount::panic_str("error transferring");
    }

    emit AppInstalled(app_id, caller, app.owner, app.price);
}

public fun StoreContract::get_app(app_id: u64) -> App {
    move_from(self.id_to_app.get(app_id).unwrap_or_default())
}

public fun StoreContract::get_all_apps() -> vector<App> {
    self.all_app.clone()
}

public fun StoreContract::get_all_app_uris() -> vector<string> {
    self.all_app.iter().map(|app: &App| app.uri.clone()).collect()
}

public fun StoreContract::get_user_app_uri(user: address, index: u64) -> string {
    let mut count: u64 = 0;
    for app in &self.all_app {
        if app.owner == user {
            if count == index {
                return app.uri.clone();
            }
            count += 1;
        }
    }
    LibraAccount::default()
}
   
}