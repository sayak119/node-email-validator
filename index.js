// importing the built-in dns module.
var DNS = require('dns');

/* a function to test if email is valid or not. This follows RFC 5322 Official Standard.
   refer https://tools.ietf.org/html/rfc5322 */
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

module.exports = function(emailAddress)
{
    return new Promise((resolve, reject) =>
    {
        if (validateEmail(emailAddress))
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
                            resolve({user:user, domain:domain, isEmailValid:true, mxRecords:mx, possibility:true, timeout:false});
                        }
                        else if (mxLength > 1)
                        {
                            resolve({user:user, domain:domain, isEmailValid:true, mxRecords:mx, possibility:false, timeout:false});
                        }
                        else
                        {
                            resolve({user:user, domain:domain, isEmailValid:false, mxRecords:[], possibility:true, timeout:false});
                        }
                    }
                }
                else if (error.code == 'ENOTFOUND')
                {
                    resolve({user:user, domain:domain, isEmailValid:false, mxRecords:[], mxRecordExist:false, timeout:false});
                }
                else if (error.code == 'ENODATA')
                {
                    resolve({user:user, domain:domain, isEmailValid:false, mxRecords:[], possibility:true, timeout:false});
                }
                else if (error.code == 'ETIMEOUT')
                {
                    resolve({user:user, domain:domain, isEmailValid:false, mxRecords:[], possibility:true, timeout:true});
                }
                else
                {
                    reject(new Error(error.code));
                }
            });
        }
        else
        {
            reject(new Error('Invalid format of email address'));
        }
    });
};