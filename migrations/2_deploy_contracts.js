const Migrations = artifacts.require("TimeLock");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
