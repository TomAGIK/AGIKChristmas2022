// ==================================================
// API HANDLER CLASS
// ==================================================

export class API
{
    constructor () 
    {
        this.base = window.location.origin;
        // this.csrf = document.querySelector('meta[name="csrf-token"]').content;
        this.update_csrf();
    }



    auth_check () 
    {
        return this.fetch(this.base+'/api/user/auth_check', 'GET', {}).then(res => res.json());
    }

    // === LEADERBOARD ===

    leaderboard_index () 
    {
        return this.fetch(this.base+'/api/leaderboard', 'GET').then(res => res.json());
    }

    leaderboard_create (data) 
    {
        return this.fetch(this.base+'/api/leaderboard', 'POST', data).then(res => res.json());
    }

    leaderboard_read (id) 
    {
        this.fetch(this.base+'/api/user_submodule/'+id, 'GET');
    }
    
    leaderboard_update (id, data) 
    {
        this.fetch(this.base+'/api/user_submodule/'+id, 'PUT', data);
    }

    leaderboard_delete (id) 
    {
        this.fetch(this.base+'/api/user_submodule/'+id, 'DELETE', {});
    }




    update_csrf (callback=()=>{}) 
    {
        return this.fetch(this.base+'/sanctum/csrf-cookie', 'GET').then(response => { 
            var cookies = document.cookie.split(";");
            
            for (let i=0; i<cookies.length; i++) {
                let cookie = cookies[i].split("=");
                if (cookie[0].trim() === 'XSRF-TOKEN') {
                    this.csrf = decodeURIComponent(cookie[1]);
                    i+=cookies.length;
                }
            }
        });
    }
    
    fetch (endpoint, method, data={}) 
    {
        // Callback parameter (response)
        let settings = {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-XSRF-TOKEN': this.csrf
            },
        }
        if (method !== 'GET') settings.body = JSON.stringify(data);
        return fetch(endpoint, settings);
    }
}
