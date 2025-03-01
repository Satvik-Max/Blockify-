const DocumentVerifier = artifacts.require("DocumentVerifier");

module.exports = function (deployer) {
    deployer.deploy(DocumentVerifier);
};
