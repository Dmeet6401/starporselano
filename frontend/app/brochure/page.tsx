/* ---------------------------------------------------------------------------
   Brochure.tsx  –  v2
   ---------------------------------------------------------------------------
   • Same structure as before, but **Preview** no longer carries anything that
     could be mistaken for a download action (icon changed, no helpers, no
     `download` attribute).                                                */
/* eslint-disable @next/next/no-img-element */

"use client"

// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------
import Header from "../components/header"
import Footer from "../components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Eye } from "lucide-react"        // ⬅️  Added Eye icon for preview
import HeroSection from "../components/hero-section"
import { useEffect, useState } from "react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface TileSize {
  _id: string
  tile_size_name: string
}

interface Brochure {
  _id: string
  brochure_name: string
  brochure_url: string
  tile_size_id: TileSize | string
}

// ---------------------------------------------------------------------------
// Helper – create “force-download” URL for the **DOWNLOAD** button only
// ---------------------------------------------------------------------------
const makeDownloadUrl = (url: string): string =>
  `${url}${url.includes("?") ? "&" : "?"}ik-attachment=true`

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function Brochure() {
  // ----- state -------------------------------------------------------------
  const [tileSizes, setTileSizes] = useState<TileSize[]>([])
  const [brochures, setBrochures] = useState<Brochure[]>([])
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null)

  // ----- data fetch --------------------------------------------------------
  useEffect(() => {
    const fetchTileSizes = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"
        const res = await fetch(`${base}/api/tile/get-all-tile-sizes`)
        const data = await res.json()
        if (data.tileSizes) {
          setTileSizes(data.tileSizes)
          if (!selectedSizeId && data.tileSizes.length > 0) {
            setSelectedSizeId(data.tileSizes[0]._id)
          }
        }
      } catch (err) {
        console.error("Failed to fetch tile sizes:", err)
      }
    }

    const fetchBrochures = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"
        const res = await fetch(`${base}/api/brochure/get-all-brochures`)
        const data = await res.json()
        if (data.brochures) setBrochures(data.brochures)
      } catch (err) {
        console.error("Failed to fetch brochures:", err)
      }
    }

    fetchTileSizes()
    fetchBrochures()
  }, [selectedSizeId])

  // ----- derived list ------------------------------------------------------
  const filteredBrochures = selectedSizeId
    ? brochures.filter((b) => {
        const sizeId = typeof b.tile_size_id === "string" ? b.tile_size_id : b.tile_size_id?._id
        return sizeId === selectedSizeId
      })
    : brochures

  // ----- render ------------------------------------------------------------
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection
        title="Brochures & Catalogues"
        subtitle="Download our product catalogues and brochures to explore our complete collection of premium ceramic and porcelain tiles"
      />

      {/* ------------------------------------------------------------------ */}
      {/* Catalogue list                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* ------------------ sidebar filter --------------------------- */}
            <div className="lg:col-span-3">
              <Card className="p-6 sticky top-20">
                <div className="border-l-4 border-blue-600 pl-4 mb-6">
                  <h2 className="text-xl font-bold text-gray-900">OUR CATALOGUE</h2>
                </div>

                <ul className="space-y-3">
                  {tileSizes.map((size) => (
                    <li key={size._id} className="flex items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      <button
                        onClick={() => setSelectedSizeId(size._id)}
                        className={`flex-1 text-left py-1 px-1 rounded-md transition-colors ${
                          selectedSizeId === size._id
                            ? "font-semibold text-blue-600 bg-blue-100"
                            : "text-gray-700 hover:text-blue-600"
                        }`}
                      >
                        {size.tile_size_name.trim()}
                      </button>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* ------------------ brochure grid ---------------------------- */}
            <div className="lg:col-span-9">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBrochures.length > 0 ? (
                  filteredBrochures.map((brochure) => {
                    const sizeName =
                      typeof brochure.tile_size_id === "object" && brochure.tile_size_id
                        ? brochure.tile_size_id.tile_size_name
                        : undefined

                    return (
                      <div key={brochure._id} className="flex flex-col">
                        {/* ---------- thumbnail + PREVIEW (no download) ---- */}
                        <div className="relative group">
                          <div className="overflow-hidden rounded-t-lg">
                            <img
                              src="/placeholder.svg?height=400&width=300"
                              alt={`${brochure.brochure_name} Catalogue`}
                              className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>

                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                            <div className="transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                              {/* PREVIEW – opens PDF inline, uses Eye icon */}
                              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                                <a
                                  href={brochure.brochure_url}        // ← plain URL, no attachment flag
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Eye className="mr-2 h-4 w-4" />   {/* Eye instead of Download */}
                                  Preview
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* ---------- footer with DOWNLOAD ----------------- */}
                        <div className="bg-blue-600 text-white p-4 rounded-b-lg">
                          <div className="text-lg font-medium mb-1">E-CATALOGUE</div>
                          <div className="text-2xl font-bold mb-3 line-clamp-2" title={brochure.brochure_name}>
                            {brochure.brochure_name}
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="text-sm text-blue-100 truncate" title={sizeName || ""}>
                              {sizeName}
                            </div>

                            {/* DOWNLOAD – forces attachment */}
                            <Button
                              variant="secondary"
                              size="sm"
                              className="bg-white text-blue-600 hover:bg-blue-50"
                              asChild
                            >
                              <a
                                href={makeDownloadUrl(brochure.brochure_url)} // attachment flag added
                                download={brochure.brochure_name.replace(/\s+/g, "_") + ".pdf"}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                DOWNLOAD
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="col-span-full text-center text-gray-500">No brochures available</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Technical specs summary                                            */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Technical Specifications</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our catalogues contain detailed technical specifications for all our products
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-gray-700">Technical Parameters</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-700">Product Designs</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">20+</div>
              <div className="text-gray-700">Size Variations</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-700">Quality Assurance</div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
