import Asset from '../models/Asset.js';

export const getAssets = async (req, res) => {
  try {
    const assets = await Asset.find({ userId: req.user.id });
    
    // Simulate real-time price updates for demo
    const updatedAssets = assets.map(asset => {
      const variation = (Math.random() - 0.5) * 0.02; // 2% variation
      asset.currentPrice = asset.currentPrice || asset.purchasePrice;
      asset.currentPrice = asset.currentPrice * (1 + variation);
      return asset;
    });

    res.json(updatedAssets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAsset = async (req, res) => {
  const { name, symbol, type, quantity, purchasePrice } = req.body;
  try {
    const asset = await Asset.create({
      userId: req.user.id,
      name,
      symbol,
      type,
      quantity,
      purchasePrice,
      currentPrice: purchasePrice // Start with purchase price
    });
    res.status(201).json(asset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAsset = async (req, res) => {
  try {
    await Asset.findByIdAndDelete(req.params.id);
    res.json({ message: 'Asset removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
