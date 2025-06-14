"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "../components/header";
import Footer from "../components/footer";
import Link from "next/link";
import { Pencil, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TileType {
  _id: string;
  tile_type_name: string;
  is_deleted: boolean;
}

interface TileSize {
  _id: string;
  tile_size_name: string;
  is_deleted: boolean;
}

interface Tile {
  _id: string;
  tile_name: string;
  tile_type_id: string;
  tile_size_id: string;
  tile_photo: any;
  description?: string;
  is_deleted: boolean;
}

interface Brochure {
  _id: string;
  brochure_name: string;
  brochure_url: string;
  tile_size_id: string;
  is_deleted: boolean;
}

function TilesPageContent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const [tileTypes, setTileTypes] = useState<TileType[]>([]);
  const [tileSizes, setTileSizes] = useState<TileSize[]>([]);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [brochures, setBrochures] = useState<Brochure[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newTileType, setNewTileType] = useState("");
  const [newTileSize, setNewTileSize] = useState("");
  const [newTile, setNewTile] = useState<{
    name: string;
    type: string;
    size: string;
    description: string;
    image?: File;
  }>({
    name: "",
    type: "",
    size: "",
    description: "",
    image: undefined,
  });

  const [newBrochure, setNewBrochure] = useState<{
    name: string;
    file?: File;
    tileSize: string;
  }>({
    name: "",
    file: undefined,
    tileSize: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: string } | null>(null);

  const resetForm = () => {
    setNewTileType("");
    setNewTileSize("");
    setNewTile({
      name: "",
      type: "",
      size: "",
      description: "",
      image: undefined,
    });
    setNewBrochure({ name: "", file: undefined, tileSize: "" });
    setEditMode(false);
    setEditId(null);
  };

  useEffect(() => {
    fetchData();
    fetchBrochures();
    
    // Handle productId from URL if present
    if (productId) {
      // This is just a placeholder - you would need to implement actual product fetching
      // based on your API structure
      toast({
        title: "Edit Product",
        description: `Loading product with ID: ${productId}`,
      });
      
      // Example: Set edit mode and populate form with product data
      setEditMode(true);
      setEditId(productId);
      
      // Fetch product data and populate the form
      // This is a placeholder - replace with actual API call
      fetchProductById(productId);
    }
  }, [productId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [
        tileTypesResponse,
        tileSizesResponse,
        tilesResponse,
      ] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api/tile/get-all-tile-types`),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api/tile/get-all-tile-sizes`),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api/tile/get-all-tiles`),
      ]);

      if (!tileTypesResponse.ok || !tileSizesResponse.ok || !tilesResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const tileTypesData = await tileTypesResponse.json();
      const tileSizesData = await tileSizesResponse.json();
      const tilesData = await tilesResponse.json();

      setTileTypes(tileTypesData.tileTypes || []);
      setTileSizes(tileSizesData.tileSizes || []);
      setTiles(tilesData.tiles || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductById = async (id: string) => {
    try {
      // This is a placeholder - replace with actual API endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api/products/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      
      const data = await response.json();
      
      // Populate the form with product data
      // This is just an example - adjust based on your actual data structure
      if (data.product) {
        // If it's a tile product
        setNewTile({
          name: data.product.name || "",
          type: data.product.type_id?.toString() || "",
          size: data.product.size_id?.toString() || "",
          description: data.product.description || "",
        });
        
        // Set the active tab based on product type
        // This assumes you have a way to determine the product type
        // You might need to adjust this logic based on your data structure
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Failed to fetch product data. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const fetchBrochures = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api/brochure/get-all-brochures`);
      const data = await res.json();
      if (data.brochures) setBrochures(data.brochures);
    } catch (error) {
      console.error("Error fetching brochures:", error);
    }
  };

  const handleEdit = (type: string, id: string) => {
    setEditMode(true);
    setEditId(id);

    switch (type) {
      case "tileType":
        const tileType = tileTypes.find((t) => t._id === id);
        if (tileType) {
          setNewTileType(tileType.tile_type_name);
        }
        break;
      case "tileSize":
        const tileSize = tileSizes.find((s) => s._id === id);
        if (tileSize) {
          setNewTileSize(tileSize.tile_size_name);
        }
        break;
      case "tile":
        const tile = tiles.find((t) => t._id === id);
        if (tile) {
          setNewTile({
            name: tile.tile_name,
            type: tile.tile_type_id,
            size: tile.tile_size_id,
            description: tile.description || "",
          });
        }
        break;
      case "brochure":
        const brochure = brochures.find((b) => b._id === id);
        if (brochure) {
          setNewBrochure({
            name: brochure.brochure_name,
            tileSize: brochure.tile_size_id,
          });
        }
        break;
    }
  };

  const handleAddTileType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTileType.trim()) return;
  
    try {
        const method = editMode && editId ? "PUT" : "POST";
        const endpoint = editMode && editId
            ? `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api/tile/edit-tile-type/${editId}`
            : `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api/tile/add-tile-type`;

        const response = await fetch(endpoint, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editMode && editId 
                ? { tile_type_name: newTileType }
                : { tile_type_name: newTileType }
            ),
        });

        if (!response.ok) throw new Error("Failed to add/update tile type");
  
        const data = await response.json();
  
        if (editMode && editId) {
            setTileTypes(
                tileTypes.map((type) =>
                    type._id === editId 
                        ? { ...type, tile_type_name: newTileType } 
                        : type
                )
            );
            toast({
                title: "Success",
                description: "Tile type updated successfully",
            });
        } else {
            const newType: TileType = {
                _id: data.tileType._id,
                tile_type_name: newTileType,
                is_deleted: false,
            };
            setTileTypes([...tileTypes, newType]);
            toast({
                title: "Success",
                description: "Tile type added successfully",
            });
        }
        resetForm();
    } catch (error) {
        console.error("Error:", error);
        toast({
            title: "Error",
            description: "Failed to add/update tile type. Please try again later.",
            variant: "destructive",
        });
    }
};
  
const handleAddTileSize = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newTileSize) {
    toast({
      title: "Error",
      description: "Please enter a tile size",
      variant: "destructive",
    });
    return;
  }

  try {
    const url = editMode
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api/tile/edit-tile-size/${editId}`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api/tile/add-tile-size`;

    const response = await fetch(url, {
      method: editMode ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tile_size_name: newTileSize,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save tile size");
    }

    const data = await response.json();

    if (editMode) {
      setTileSizes(
        tileSizes.map((size) =>
          size._id === editId
            ? { ...size, tile_size_name: newTileSize }
            : size
        )
      );
    } else {
      const newSize: TileSize = {
        _id: data.tileSize._id,
        tile_size_name: newTileSize,
        is_deleted: false,
      };
      setTileSizes([...tileSizes, newSize]);
    }

    toast({
      title: "Success",
      description: editMode
        ? "Tile size updated successfully"
        : "Tile size added successfully",
    });

    resetForm();
  } catch (error) {
    console.error("Error saving tile size:", error);
    toast({
      title: "Error",
      description: "Failed to save tile size. Please try again.",
      variant: "destructive",
    });
  }
};
  
const handleAddTile = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!newTile.name || !newTile.type || !newTile.size) {
    toast({
      title: "Error",
      description: "Please fill in all required fields",
      variant: "destructive",
    });
    return;
  }

  // For new tiles, an image is mandatory; for edits it's optional
  if (!editMode && !newTile.image) {
    toast({
      title: "Error",
      description: "Please select an image (.jpg/.jpeg) for the tile",
      variant: "destructive",
    });
    return;
  }

  try {
    let photoUrl: string | undefined = undefined;

    // Upload image if a new one is provided
    if (newTile.image) {
      const uploadForm = new FormData();
      uploadForm.append("file", newTile.image as Blob);

      const uploadRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api/documents/upload`,
        {
          method: "POST",
          body: uploadForm,
        }
      );

      if (!uploadRes.ok) throw new Error("Failed to upload tile image");

      const uploadJson = await uploadRes.json();
      photoUrl = uploadJson.url as string;
    }

    // Build the payload for tile create / update
    const payload: any = {
      tile_name: newTile.name,
      tile_type_id: newTile.type,
      tile_size_id: newTile.size,
    };
    if (newTile.description) payload.description = newTile.description;
    if (photoUrl) payload.tile_photo = photoUrl;

    const endpoint = editMode
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api/tile/edit-tile/${editId}`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api/tile/add-tile`;

    const response = await fetch(endpoint, {
      method: editMode ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Failed to save tile");

    const data = await response.json();

    if (editMode) {
      setTiles(
        tiles.map((tile) =>
          tile._id === editId
            ? {
                ...tile,
                tile_name: newTile.name,
                tile_type_id: newTile.type,
                tile_size_id: newTile.size,
                description: newTile.description || "",
                tile_photo: photoUrl || tile.tile_photo,
              }
            : tile
        )
      );
    } else {
      const newTileItem: Tile = {
        _id: data.tile._id,
        tile_name: newTile.name,
        tile_type_id: newTile.type,
        tile_size_id: newTile.size,
        description: newTile.description || "",
        tile_photo: data.tile.tile_photo,
        is_deleted: false,
      };
      setTiles([...tiles, newTileItem]);
    }

    toast({
      title: "Success",
      description: editMode ? "Tile updated successfully" : "Tile added successfully",
    });

    resetForm();
  } catch (error) {
    console.error("Error saving tile:", error);
    toast({
      title: "Error",
      description: "Failed to save tile. Please try again.",
      variant: "destructive",
    });
  }
};
  


const handleAddBrochure = async (e: React.FormEvent<HTMLFormElement>) => {
  console.log("first")
  e.preventDefault();
  if (!newBrochure.name || !newBrochure.file || !newBrochure.tileSize) {
    toast({
      title: "Error",
      description: "Please fill in all required fields",
      variant: "destructive",
    });
    return;
  }

  try {
    // Step 1: Upload the brochure PDF and obtain its URL
    const formData = new FormData();
    // The backend service expects the file field name to be 'photo'
    formData.append("file", newBrochure.file as Blob);

    const uploadResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api/documents/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload brochure file");
    }

    const uploadData = await uploadResponse.json();
    console.log(uploadData)
    const brochureUrl: string = uploadData.url;

    // Step 2: Persist brochure metadata along with the generated URL
    const brochureResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api/brochure/add-brochure`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brochure_name: newBrochure.name,
          brochure_url: brochureUrl,
          tile_size_id: newBrochure.tileSize,
        }),
      }
    );
    console.log(brochureResponse)
    if (!brochureResponse.ok) {
      throw new Error("Failed to add brochure data");
    }

    toast({
      title: "Success",
      description: "Brochure added successfully",
    });

    // Reset form and refresh brochure list
    setNewBrochure({ name: "", file: undefined, tileSize: "" });
    fetchBrochures();
  } catch (error) {
    console.error("Error adding brochure:", error);
    toast({
      title: "Error",
      description: "Failed to add brochure. Please try again later.",
      variant: "destructive",
    });
  }
};

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
        let response;
        switch (itemToDelete.type) {
            case "tileType":
                response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api/tile/delete-tile-type/${itemToDelete.id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    setTileTypes(tileTypes.filter((type) => type._id !== itemToDelete.id));
                }
                break;
            case "tileSize":
                response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api/tile/delete-tile-size/${itemToDelete.id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    setTileSizes(tileSizes.filter((size) => size._id !== itemToDelete.id));
                }
                break;
            case "tile":
                response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api/tile/delete-tile/${itemToDelete.id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    setTiles(tiles.filter((tile) => tile._id !== itemToDelete.id));
                }
                break;
        }

        if (response && response.ok) {
            toast({
                title: "Success",
                description: `${
                    itemToDelete.type === "tileType"
                        ? "Tile type"
                        : itemToDelete.type === "tileSize"
                        ? "Tile size"
                        : "Tile"
                } deleted successfully`,
            });
        } else {
            throw new Error('Delete operation failed');
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        toast({
            title: "Error",
            description: "Failed to delete item. Please try again later.",
            variant: "destructive",
        });
    }

    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  const confirmDelete = (type: string, id: string) => {
    setItemToDelete({ type, id });
    setDeleteConfirmOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <section className="relative py-20 bg-gradient-to-r from-gray-900 to-blue-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/placeholder.svg?height=400&width=1200"
            alt="Tile Management Background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Tile Management</h1>
          <div className="w-16 h-1 bg-blue-500 mx-auto mb-6"></div>
          <nav className="text-blue-200">
            <Link href="/" className="hover:text-white cursor-pointer">
              HOME
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-white">TILE MANAGEMENT</span>
          </nav>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="types" className="space-y-8">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="types">Tile Types</TabsTrigger>
              <TabsTrigger value="sizes">Tile Sizes</TabsTrigger>
              <TabsTrigger value="tiles">Tiles</TabsTrigger>
              <TabsTrigger value="brochures">Brochures</TabsTrigger>
            </TabsList>

            <TabsContent value="types">
              <Card>
                <CardHeader>
                  <CardTitle>{editMode ? "Edit" : "Add"} Tile Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddTileType} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tileType">Tile Type Name</Label>
                      <Input
                        id="tileType"
                        value={newTileType}
                        onChange={(e) => setNewTileType(e.target.value)}
                        placeholder="Enter tile type name"
                        className="w-full"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        {editMode ? "Update" : "Add"} Tile Type
                      </Button>
                      {editMode && (
                        <Button type="button" variant="outline" onClick={resetForm}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </form>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Existing Tile Types</h3>
                    {isLoading ? (
                      <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        {tileTypes.length > 0 ? (
                          tileTypes.map((type) => (
                            <div key={type._id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-gray-100 transition-colors">
                              <span className="font-medium">{type.tile_type_name}</span>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit("tileType", type._id)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => confirmDelete("tileType", type._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500">No tile types available</p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sizes">
              <Card>
                <CardHeader>
                  <CardTitle>{editMode ? "Edit" : "Add"} Tile Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddTileSize} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tileSize">Tile Size (e.g. 300 x 300)</Label>
                      <Input
                        id="tileSize"
                        value={newTileSize}
                        onChange={(e) => setNewTileSize(e.target.value)}
                        placeholder="Enter tile size"
                        className="w-full"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        {editMode ? "Update" : "Add"} Tile Size
                      </Button>
                      {editMode && (
                        <Button type="button" variant="outline" onClick={resetForm}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </form>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Existing Tile Sizes</h3>
                    <div className="grid gap-3">
                      {tileSizes.length > 0 ? (
                        tileSizes.map((size: TileSize) => (
                          <div key={size._id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-gray-100 transition-colors">
                            <div>
                              <span className="font-medium">{size.tile_size_name}</span>
                              <span className="text-sm text-gray-500 ml-2">{size.tile_size_name}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit("tileSize", size._id)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => confirmDelete("tileSize", size._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No tile sizes available</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tiles">
              <Card>
                <CardHeader>
                  <CardTitle>{editMode ? "Edit" : "Add"} Tile</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddTile} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tileName">Tile Name</Label>
                      <Input
                        id="tileName"
                        value={newTile.name}
                        onChange={(e) =>
                          setNewTile({ ...newTile, name: e.target.value })
                        }
                        placeholder="Enter tile name"
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tileType">Tile Type</Label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={newTile.type}
                        onChange={(e) =>
                          setNewTile({ ...newTile, type: e.target.value })
                        }
                      >
                        <option value="">Select Tile Type</option>
                        {tileTypes.map((type) => (
                          <option key={type._id} value={type._id}>
                            {type.tile_type_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tileSize">Tile Size</Label>
                      <select
                        value={newTile.size}
                        onChange={(e) => setNewTile({ ...newTile, size: e.target.value })}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Select Tile Size</option>
                        {tileSizes.map((size) => (
                          <option key={size._id} value={size._id}>
                            {size.tile_size_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tileImage">Tile Image (.jpg, .jpeg)</Label>
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("tileImage")?.click()}
                          className="flex-shrink-0"
                        >
                          Choose File
                        </Button>
                        <span className="text-sm text-gray-500">
                          {newTile.image ? newTile.image.name : "No file chosen"}
                        </span>
                        <Input
                          id="tileImage"
                          type="file"
                          accept=".jpg,.jpeg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (
                              file &&
                              (file.type === "image/jpeg" ||
                                file.name.endsWith(".jpg") ||
                                file.name.endsWith(".jpeg"))
                            ) {
                              setNewTile({ ...newTile, image: file });
                            } else {
                              alert("Only .jpg and .jpeg files are allowed");
                            }
                          }}
                          className="hidden"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        {editMode ? "Update" : "Add"} Tile
                      </Button>
                      {editMode && (
                        <Button type="button" variant="outline" onClick={resetForm}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </form>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Existing Tiles</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {tiles.length > 0 ? (
                        tiles.map((tile) => (
                          <Card key={tile._id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                            <div className="relative aspect-square bg-gray-100">
                              {tile.tile_photo ? (
                                <img
                                  src={tile.tile_photo}
                                  alt={tile.tile_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <path d="M21 15l-5-5L5 21" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-lg truncate" title={tile.tile_name}>
                                    {tile.tile_name}
                                  </h4>
                                  <div className="mt-2 space-y-1 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                        <line x1="12" y1="22.08" x2="12" y2="12" />
                                      </svg>
                                      <span>{tileTypes.find((t) => t._id === tile.tile_type_id)?.tile_type_name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4"
                                      >
                                        <line x1="9" y1="21" x2="9" y2="9" />
                                      </svg>
                                      <span>{tileSizes.find((s) => s._id === tile.tile_size_id)?.tile_size_name}</span>
                                    </div>
                                  </div>
                                  {tile.description && (
                                    <p className="mt-3 text-sm text-gray-600 line-clamp-2" title={tile.description}>
                                      {tile.description}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-col gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleEdit("tile", tile._id)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => confirmDelete("tile", tile._id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <p>No tiles available</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="brochures">
              <Card>
                <CardHeader>
                  <CardTitle>Add Brochure</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddBrochure} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="brochureName">Brochure Name</Label>
                      <Input
                        id="brochureName"
                        value={newBrochure.name}
                        onChange={(e) => setNewBrochure({ ...newBrochure, name: e.target.value })}
                        placeholder="Enter brochure name"
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brochureFile">Upload Brochure (PDF)</Label>
                      <Input
                        id="brochureFile"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && file.type === "application/pdf") {
                            setNewBrochure({ ...newBrochure, file });
                          } else {
                            alert("Only PDF files are allowed");
                          }
                        }}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brochureTileSize">Tile Size</Label>
                      <select
                        id="brochureTileSize"
                        className="w-full p-2 border rounded-md"
                        value={newBrochure.tileSize}
                        onChange={(e) => setNewBrochure({ ...newBrochure, tileSize: e.target.value })}
                      >
                        <option value="">Select Tile Size</option>
                        {tileSizes.map((size) => (
                          <option key={size._id} value={size._id}>
                            {size.tile_size_name}
                          </option>
                        ))}
                      </select>
                    </div> 
                    <Button type="submit" className="w-full">Add Brochure</Button>
                  </form>
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Existing Brochures</h3>
                    <div className="grid gap-3">
                      {brochures.length > 0 ? (
                        brochures.map((brochure) => (
                          <div key={brochure._id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-gray-100 transition-colors">
                            <span className="font-medium">{brochure.brochure_name}</span>
                            <span className="text-sm text-gray-500 ml-2">{tileSizes.find((s) => s._id === brochure.tile_size_id)?.tile_size_name}</span>
                            <a href={brochure.brochure_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-4">View PDF</a>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500">No brochures available</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              {itemToDelete?.type}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function TilesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TilesPageContent />
    </Suspense>
  );
}
