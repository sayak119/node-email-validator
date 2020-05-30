// importing the built-in dns module.
var DNS = require('dns');

module.exports = function(emailAddress)
{
    return new Promise((resolve, reject) =>
    {
        var splitEmail = emailAddress.split('@');
        var user = splitEmail[0];
        var domain = splitEmail[1];
        // refer https://nodejs.org/api/dns.html#dns_dnspromises_resolvemx_hostname
        DNS.resolveMx(domain, (error, mx) =>
        {
            if (typeof(mx) != 'undefined')
            {
                if (mx)
                {
                    /* possibility of temporary email, private organization email or lack
                        of usgae of that domain name. We are making use of number of records
                        to check for this possibility. */
                    var mxLength = mx.length;
                    if (mxLength === 1)
                    {
                        resolve({user:user, domain:domain, isEmailValid:true, mxRecords:mx, possibility:true});
                    }
                    else if (mxLength > 1)
                    {
                        resolve({user:user, domain:domain, isEmailValid:true, mxRecords:mx, possibility:false});
                    }
                    else
                    {
                        resolve({user:user, domain:domain, isEmailValid:false, mxRecords:null, possibility:true});
                    }
                }
            }
            else if (error.code == 'ENOTFOUND')
            {
                resolve({user:user, domain:domain, isEmailValid:false, mxRecords:null, mxRecordExist:false});
            }
            else
            {
                reject(new Error(error.code));
            }
        });
    });
};